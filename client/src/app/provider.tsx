'use client';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface ProvidersProps {
    children: React.ReactNode;
}

function Providers({ children }: ProvidersProps) {
    const [client] = React.useState(new QueryClient());
    return (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
}

export default Providers;
