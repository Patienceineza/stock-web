import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../app/auth/login';
import Users from '@/app/dashboard/users';
import Widget from '@/app/dashboard/Widget';
import ProfilePage from '@/app/profile';
import AdminLayout from '@/components/Admin/DefaultLayout';
import CategoriesList from '@/app/dashboard/categories';
import ProductsList from '@/app/dashboard/products';
import StockMovementsList from '@/app/dashboard/stock_movement';
import POS from '@/app/dashboard/pos';
import SalesList from '@/app/dashboard/pos/sales';
import Orders from '@/app/dashboard/pos/orders';
import ExchangeRateManager from '@/app/dashboard/exchange';


export default function AppRoutes() {
    return (
        <>
        {/* <Header />
        <Sidebar /> */}
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
            <Route path="login" element={<Login />} />
            <Route path="account" element={<AdminLayout />}>

                <Route index element={<Widget />} />
                <Route path='profile' element={<ProfilePage />} />
                <Route path='category' element={<CategoriesList />} />
                <Route path='users' element={<Users />} />
                <Route path='products' element={<ProductsList />} />
                <Route path='stock_movement' element={<StockMovementsList />} />
                <Route path='pos' element={<POS />} />
                <Route path='sales' element={<SalesList />} />
                <Route path='orders' element={<Orders />} />
                <Route path='rate' element={<ExchangeRateManager />} />
            </Route>
        </Routes>
        </>
    );
}
