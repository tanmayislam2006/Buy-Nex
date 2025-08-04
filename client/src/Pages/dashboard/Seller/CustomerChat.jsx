import React from 'react';
import useAuth from '../../../Hooks/useAuth';
import SellerChat from '../../../components/Chat/SellerChat';

const CustomerChat = () => {
    const {user}=useAuth()
    return (
        <div>
            <SellerChat sellerEmail={user?.email}/>
        </div>
    );
};

export default CustomerChat;