import React, { useContext } from 'react';
import Context from './../Context/Context';

const useAuth = () => {
 const sharedData=useContext(Context)
 return sharedData
};

export default useAuth;