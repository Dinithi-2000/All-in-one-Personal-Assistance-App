import { useState, useEffect, useCallback } from "react";
import { filterServiceProviders } from "../../../Lib/api";

const useServiceProviders = () => {
  const [category, setCategory] = useState("Pet Care");
  const [filters, setFilters] = useState({
    minHourlyRate: 500,
    maxHourlyRate: 2000,
    servicesOffered: [],
    languagesSpoken: [],
    categoryType: "Pet Care",
  });
  const [serviceProviders, setServiceProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Debounced fetch function
  const fetchServiceProviders = useCallback(async (abortController) => {
    setLoading(true);
    setError(null);
    try {
      const response = await filterServiceProviders(
        {
          ...filters,
          categoryType: category,
          page,
        },
        { signal: abortController?.signal }
      );
      
      setServiceProviders(prev => 
        page === 1 
          ? response.data.serviceProviders || []
          : [...prev, ...(response.data.serviceProviders || [])]
      );
      setHasMore(response.data.hasMore || false);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError("Failed to fetch service providers");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }, [filters, category, page]);

  // Debounced effect for fetching
  useEffect(() => {
    const abortController = new AbortController();
    const timer = setTimeout(() => {
      fetchServiceProviders(abortController);
    }, 300); // 300ms debounce delay

    return () => {
      abortController.abort();
      clearTimeout(timer);
    };
  }, [fetchServiceProviders]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filters, category]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const toggleFilter = (filterKey, value) => {
    setFilters((prev) => {
      const currentValues = prev[filterKey] || [];
      return {
        ...prev,
        [filterKey]: currentValues.includes(value)
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value],
      };
    });
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  return {
    category,
    setCategory,
    filters,
    updateFilters,
    toggleFilter,
    serviceProviders,
    loading,
    error,
    loadMore,
    hasMore,
  };
};

export default useServiceProviders;