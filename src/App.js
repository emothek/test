import React, { useState } from 'react';
import { useFetch } from './hooks';
import './App.css';

import { connect } from 'react-redux'
import { queryKeyword } from './reducers'

const App = (props) => {
	const [query, setQuery] = useState('');

	const url = query && `https://hn.algolia.com/api/v1/search?query=${query}`;

	const { status, data, error } = useFetch(url, query);

	const handleSubmit = (e) => {
		e.preventDefault();

		const query = e.target.search.value;
		if (query) {
			setQuery(query.trim());
			props.queryKeyword(query.trim());
		}
	};

	const posts = data.hits;

	return (
		<div className="App">
			<header> App test </header>
			<form className="Form" onSubmit={handleSubmit}>
				<input
					type="text"
					autoFocus
					autoComplete="off"
					name="search"
					placeholder="..."
				/>
				<button> Recherche </button>
			</form>
			<main>
				{status === 'idle' && (
					<div> Rechercher un article de l'API ouvert </div>
				)}
				{status === 'error' && <div>{error}</div>}
				{status === 'fetching' && <div className="loading"></div>}
				{status === 'fetched' && (
					<>
						<div className="query"> Résultat pour {query} </div>
						{posts && posts.length === 0 && <div> Pas de posts :( </div>}
						{posts && posts.map((article) => (
							<div className="article" key={article.objectID}>
								<a target="_blank" href={article.url}>
									{article.title}
								</a>{' '}
								by {article.author}
							</div>
						))}
					</>
				)}
			</main>
		</div>
	);
};


const mapDispatchToProps = (dispatch) => {
	return {
	  // dispatching actions returned by action creators
	  queryKeyword: (keyword) => dispatch(queryKeyword(keyword)),
	}
  }

export default connect(
	null,
	mapDispatchToProps)(App);
