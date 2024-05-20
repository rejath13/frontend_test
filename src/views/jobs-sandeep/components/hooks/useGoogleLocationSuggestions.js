// useGoogleLocationSuggestions.js
import { useEffect } from "react";
import { useGetGoogleLocationSuggestionsQuery } from "../../../../store/api/scheduler/schedulerApi";

const useGoogleLocationSuggestions = (inputLocation) => {
  const {
    data: locationSuggestions,
    isLoading: isLocationSuggestionsLoading,
    isError: isLocationSuggestionsError,
    refetch,
  } = useGetGoogleLocationSuggestionsQuery({
    inputLocation,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await refetch();
      } catch (err) {
        console.log("Error fetching suggestions data: ", err);
      }
    };
    fetchData();
  }, [inputLocation, refetch]);

  return {
    locationSuggestions,
    isLocationSuggestionsLoading,
    isLocationSuggestionsError,
  };
};

export default useGoogleLocationSuggestions;
