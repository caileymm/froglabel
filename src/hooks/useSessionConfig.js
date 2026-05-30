import { useContext } from 'react';
import { SessionConfigContext } from '../context/SessionConfigContext';

export function useSessionConfig() {
    const ctx = useContext(SessionConfigContext);
    if (!ctx) {
        throw new Error('useSessionConfig must be used within SessionConfigProvider');
    }
    return ctx;
}