const MainRoutes = {
    path: '/main',
    meta: {
        requiresAuth: true
    },
    redirect: '/main',
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
        {
            name: 'Clientes',
            path: '/',
            component: () => import('@/views/pages/ListaClientes.vue'),
            meta: { requiresAuth: true }
        },
        {
            name: 'DetalleCliente',
            path: '/detalle-cliente/:id',
            component: () => import('@/views/pages/DetalleCliente.vue'),
            props: true,
            meta: { requiresAuth: true }
        },
        {
            name: 'Reportes',
            path: '/reportes',
            component: () => import('@/views/pages/Reportes.vue'),
            props: true,
            meta: { requiresAuth: true }
        },
        {
            name: 'Empleados',
            path: '/empleados',
            component: () => import('@/views/pages/Empleados.vue'),
            props: true,
            meta: { requiresAuth: true }
        },
        
        
    ]
};

export default MainRoutes;
