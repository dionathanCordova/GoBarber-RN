import React, { createContext, useCallback, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../service/api';

interface User {
	id: string;
	name: string;
	email: string;
	avatar_url: string;
}

interface AuthState {
	token: string;
	user: User;
}

interface Credentials {
	email: string,
	password: string;
}

interface AuthContextDTO {
	user: User;
	loading: boolean;
	signIn(credentials: Credentials) : Promise<void>;
	signOut() : void;
}

const AuthContext = createContext<AuthContextDTO>({} as AuthContextDTO);

export const AuthProvider: React.FC = ({children}) => {
	const [data, setData] = useState<AuthState>({} as AuthState);
	const [ loading, setLoading ] = useState(true);

	useEffect(() => {
		async function loadStorageData(): Promise<void> {
			const [ token, user ] = await AsyncStorage.multiGet([
				'@GoBarber:token',
				'@GoBarder:user'
			]) 

			if( token[1] && user[1]) {
				api.defaults.headers.authorization = `Bearer ${token[1]}`
				setData({ token: token[1], user: JSON.parse(user[1])})
			}

			setLoading(false);
		}

		loadStorageData();
	}, []);

	const signIn = useCallback(async ({email, password}) => {
		const response = await api.post('sessions', {
			email,
			password
		});

		alert(response.data);

		const { token, user } = response.data;
		await AsyncStorage.setItem('@GoBarber:token', token);
		await AsyncStorage.setItem('@GoBarder:user', JSON.stringify(user));
		
		api.defaults.headers.authorization = `Bearer ${token}`

		setData({token, user});
	}, []);

	const signOut = useCallback(async () => {
		await AsyncStorage.multiRemove([
			'@GoBarber:token',
			'@GoBarder:user'
		]);

		setData({} as AuthState);
	}, []);

	return (
		<AuthContext.Provider value={{user: data.user, loading, signIn, signOut}}>
			{children}
		</AuthContext.Provider>
	);
};

export function useAuth(): AuthContextDTO {
	const context = useContext(AuthContext);

	if(!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}

	return context;
}
