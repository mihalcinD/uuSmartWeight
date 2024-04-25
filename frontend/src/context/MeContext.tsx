import { createContext, useContext, JSX, useState } from 'react';
import { MeResponse } from '../types/api/response/me.ts';

type Props = {
  children: JSX.Element | JSX.Element[];
};

type MeContextType = {
  me: MeResponse | undefined;
};

export const useMeContext = () => {
  return useContext(MeContext);
};

export const MeContext = createContext<MeContextType>(undefined!);

export const MeProvider = ({ children }: Props) => {
  const [me] = useState<MeResponse | undefined>({
    id: 1,
    name: 'David',
    email: 'david@unicorn.com',
    surname: 'Mihalcin',
  });

  return <MeContext.Provider value={{ me: me }}>{children}</MeContext.Provider>;
};
