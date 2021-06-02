# Test first commit by Mokhtar Megherbi

Redux store is still to be implemented, 

The hook should store fetched data in a global Redux store and manage gracefully the case where no Provider is defined.

The hook should use fetch (and not axios) and allows to pass a baseUrl (prefix) of the API so it won't be required for each request.

Data should also be stored in localstorage for cache purpose. When page is reloaded, data should be read instantly from localStorage while making the request in the background to update the cache.

Compress data before storing it in localstorage using frontend compression technology (eg. LZCompress)

When localStorage is out of space, delete the first item stored in localStorage that is bigger than the space needed to store the new item.

Add a way to protect certain entries from being cleaned.
 