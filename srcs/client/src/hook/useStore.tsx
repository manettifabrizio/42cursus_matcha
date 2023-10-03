import type { TypedUseSelectorHook } from 'react-redux';
import type { StoreState } from '@/core/store';
import type { StoreDispatch } from '@/core/store';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

// Hook ------------------------------------------------------------------------
export const useStoreDispatch: () => StoreDispatch = useDispatch;
export const useStoreSelector: TypedUseSelectorHook<StoreState> = useSelector;
