import { useEffect, useRef, useReducer, useState } from 'react'; 
// compression lib 
import jsonpack from 'jsonpack'


	const getValue = (key) => {
	  try {
		let item = localStorage.getItem(key); 
		item = jsonpack.unpack(JSON.parse(item))
		return item && item
	  } catch (error) {
 
		console.log(error);
		return null;
	  }
	};
 
	const setValue = (key, value) => {
		const storedValue = value && value instanceof Object ? value : {};
		// Save to local storage
		let compressed = jsonpack.pack(storedValue)

		try {
			localStorage.setItem(key, JSON.stringify(compressed));
		  } catch (e) {
			if (e == 'QUOTA_EXCEEDED_ERR') {
			  console.log('storage quota error');
			  
			  // removing the largest cache based on object length
			  let l = 0; let i = 0; let k = null;
			  Object.entries(localStorage).forEach((el, ix) => {
					if(el[1].length > l){
						l  = el[1].length
						i  = ix
						k  = el[0]
					} 
			  })

			  if(k){
				localStorage.removeItem(k)
			  }

			  // no infinite loop :p finger crossed !
			  setValue(key, value)

			}else{
			  console.log(e)
			  // safely log out all other errors 
			  return;
			}	
		  }


	};
 


  // ---- useFetch hook
export const useFetch = (url, query) => {
 

	const cache = useRef({});

	const initialState = {
		status: 'idle',
		error: null,
		data: [],
	};

	const [state, dispatch] = useReducer((state, action) => {
		switch (action.type) {
			case 'FETCHING':
				return { ...initialState, status: 'fetching' };
			case 'FETCHED':
				return { ...initialState, status: 'fetched', data: action.payload };
			case 'FETCH_ERROR':
				return { ...initialState, status: 'error', error: action.payload };
			default:
				return state;
		}
	}, initialState);

	useEffect(() => {
		let cancelRequest = false;
		if (!url) return;

		const fetchData = async () => {
			console.log(query)
			console.log(getValue(query))
			dispatch({ type: 'FETCHING' });
			if (cache.current[url]) {
				const data = cache.current[url];
				dispatch({ type: 'FETCHED', payload: data });
			} else if(getValue(query)){
				// loading data from cache
				let y = getValue(query)
				dispatch({ type: 'FETCHED', payload: y });

				// fetch asynchronously data from backend
				const data = await fetchAPI(url);
				cache.current[url] = data;
				// updating cache
				setValue(query, data)
				// dispatching new data so re-rendering
				dispatch({ type: 'FETCHED', payload: data });

			} else {
				try {
					const data = await fetchAPI(url);
					console.log(data)
					cache.current[url] = data;
					setValue(query, data)
					if (cancelRequest) return;
					dispatch({ type: 'FETCHED', payload: data });
				} catch (error) {
					if (cancelRequest) return;
					dispatch({ type: 'FETCH_ERROR', payload: error.message });
				}
			}
		};

		fetchData();

		return function cleanup() {
			cancelRequest = true;
		};
	}, [url]);

	return state;
};


const fetchAPI = async (url) => {
	const response = await fetch(url);
	const data = await response.json();
	return data;
}