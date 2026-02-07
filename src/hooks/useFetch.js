import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';

const useFetch = (fetchFunction, params = [], dependencies = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getApiLanguage } = useApp();

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchFunction(...params, getApiLanguage());
            setData(result);
        } catch (err) {
            setError(err.message || 'An error occurred');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [fetchFunction, getApiLanguage, ...params]);

    useEffect(() => {
        fetchData();
    }, [fetchData, ...dependencies]);

    const refetch = () => {
        fetchData();
    };

    return { data, loading, error, refetch };
};

export default useFetch;
