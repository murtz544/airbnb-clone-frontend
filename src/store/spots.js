import { csrfFetch } from "./csrf";

export const getAllSpots = () => async (dispatch) => {
    const response = await fetch("/api/spots");
    if (response.ok) {
      const payload = await response.json();
      dispatch({ type: "spots/all_spots", payload });
    }
  };
  const SPOT_DETAILS = "spots/spot_details";
  export const spotDetails = (payload) => ({
    type: SPOT_DETAILS,
    payload,
  });
  export const getSpotDetails = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    if (response.ok) {
      const spot = await response.json();
      dispatch(spotDetails(spot));//{ type: "spots/SPOT_DETAILS", spot });
      return spot;
    }
  };  

  export const getUserSpots = () => async (dispatch) => {
    const response = await csrfFetch("/api/spots/current");
    if (response.ok) {
      const spots = await response.json();
      dispatch({ type: "spots/get_user_spots", payload: spots });
    }
  };
  
  export const addNewSpot = (spot, navigate) => async () => {
    const response = await csrfFetch(`/api/spots`, {
      method: "POST",
      body: JSON.stringify(spot),
    });
    if (response.ok) {
      const addSpot = await response.json();
      navigate(`/spots/${addSpot.id}`);
      return addSpot;
    } else {
      const error = await response.json();
      throw error;
    }
  };

  export const addSpotImage = (spotId, image) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(image),
    });
  
    if (response.ok) {
      const newImage = await response.json();
      dispatch({ type: "spots/add_spot_image", newImage });
      return newImage;
    }
  };
  
  export const updateSpot = (spotId, spotInfo) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "PUT",
      headers: {},
      body: JSON.stringify(spotInfo),
    });
    if (response.ok) {
      const updatedSpot = await response.json();
      dispatch({ type: "spots/update_spot", payload: updatedSpot });
      return updatedSpot;
    } else if (!response.ok) {
      return response;
    }
  };
  
  export const deleteSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      dispatch({ type: "spots/delete_spot", spotId });
    }
  };
  const initialSpotState = {
    allSpots: {},
    spotDetails: {},
    userSpots: [],
  };

  const spotsReducer = (state = initialSpotState, action) => {
    if (action.type === "spots/all_spots") {
        const newState = { ...state, allSpots: {} };
        const spotsArray = action.payload.Spots;
        spotsArray.forEach((spot) => {
          newState.allSpots[spot.id] = spot;
        });
        return newState;
    } else if (action.type === "spots/spot_details") {
        return { ...state, spotDetails: { ...state.spotDetails, [action.payload.id]: action.payload } };
    } else if (action.type === "spots/new_spot") {
        const newState = {
            allSpots: { [action.payload.id]: action.payload, ...state.allSpots },
            spotDetails: { ...state.spotDetails, [action.payload.id]: action.payload },
          };
          return newState;
    } else if (action.type === "spots/update_spot") {
        const newState = { ...state, 
            allSpots: { ...state.allSpots, [action.payload.id]: action.payload },
            spotDetails: { ...state.spotDetails, [action.payload.id]: action.payload },
            userSpots: state.userSpots.map((spot) =>
              spot.id === action.payload.id ? action.payload : spot
            ),
          };
          return newState;
    } else if (action.type === "spots/delete_spot") {
        const newState = { ...state };
          delete newState.allSpots[action.spotId];
          newState.userSpots = newState.userSpots.filter(
            (spot) => spot.id !== action.spotId
          );
          delete newState.spotDetails[action.spotId];
          return newState;
    } else if (action.type === "spots/add_spot_image") {
        const newState = { ...state };
          const spot = newState.spotDetails[action.image.spotId];
          if (spot) {
            spot.images = spot.images || [];
            spot.images.push(action.image);
          }
          return newState;
    } else if (action.type === "spots/get_user_spots") {
        return { ...state, userSpots: action.payload.Spots };
    } else if (action.type === "spots/clear_spot_state") {
        return { ...initialState };
    } else {
        return state;
    }
  };
  
  export default spotsReducer;