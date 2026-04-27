import { fetchCategories } from '../api/backendCalls';

const SET_CATEGORIES = 'SET_CATEGORIES';
const SET_CATEGORIES_LOADING = 'SET_CATEGORIES_LOADING';

const initialState = {
  list: [],
  loading: false,
  loaded: false,
};

export const setCategories = (categories) => ({ type: SET_CATEGORIES, payload: categories });
export const setCategoriesLoading = (loading) => ({ type: SET_CATEGORIES_LOADING, payload: loading });

export const loadCategories = (force = false) => async (dispatch, getState) => {
  const { loaded, loading } = getState().categories;
  if ((loaded || loading) && !force) return;
  dispatch(setCategoriesLoading(true));
  try {
    const res = await fetchCategories();
    dispatch(setCategories(res.data));
  } catch {
    // silently fail
  } finally {
    dispatch(setCategoriesLoading(false));
  }
};

const categoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CATEGORIES:
      return { ...state, list: action.payload, loaded: true };
    case SET_CATEGORIES_LOADING:
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export default categoriesReducer;
