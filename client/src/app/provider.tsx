'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import React from 'react';

interface ProvidersProps {
    children: React.ReactNode;
}

function QueryClientProviders({ children }: ProvidersProps) {
    const [client] = React.useState(
        new QueryClient({
            defaultOptions: {
                queries: {
                    refetchOnWindowFocus: false,
                    refetchOnMount: false,
                    retry: 3,
                },
            },
        })
    );
    return (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
}

export default QueryClientProviders;
