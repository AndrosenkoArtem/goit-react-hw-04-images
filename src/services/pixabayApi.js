import axios from 'axios';
export const fetchPixabayApi = async (searchQuery, page, abortController) => {
  const response = await axios.get(
    `https://pixabay.com/api/?q=${searchQuery}&page=${page}&key=35160374-d23f2fd4bb6bf16bf356db091&image_type=photo&orientation=horizontal&per_page=12`,
    {
      signal: abortController.signal,
    }
  );
  return response.data.hits;
};
//
