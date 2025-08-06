import React from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../../Hooks/useAxios';
import AddProduct from './AddProduct';

const UpdateProduct = () => {
  const { id } = useParams();
  const axios = useAxios();

  const { data: product, isLoading, isError, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await axios.get(`/products/${id}`);
      return response.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return <AddProduct product={product} />;
};

export default UpdateProduct;