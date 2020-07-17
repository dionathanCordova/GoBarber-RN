import React, { useCallback, useEffect, useState } from 'react';

import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../hooks/AuthContext';
import { 
	Container, 
	Header, 
	HeaderTitle, 
	UserName, 
	ProfileButton, 
	UserAvatar, 
	ProvidersList, 
	ProviderContainer, 
	ProviderAvatar,
	ProviderInfo,
	ProviderName,
	ProviderMeta,
	ProviderMetaText
}from './styles';

import { useNavigation } from '@react-navigation/native';
import api from '../../service/api';

export interface Provider {
	id: string;
	name: string;
	avatar_url: string;
}

const Dashboard: React.FC = () => {
	const [ providers, setProviders ] = useState<Provider[]>([]);

	const { signOut, user } = useAuth();
	const { navigate } = useNavigation();

	useEffect(() => {
		api.get('providers').then(response => {
			setProviders(response.data);
		});
	}, []);

	const navigateToProfile = useCallback(() => {
		// navigate('profile')
		signOut()
	}, [signOut]);
	
	return (
		<Container>
			<Header>
				<HeaderTitle>
					Bem vindo, {"\n"}
					<UserName>{user.name}</UserName>
				</HeaderTitle>

				<ProfileButton onPress={navigateToProfile}>
					{/* <UserAvatar source={{ uri: user.avatar_url}} /> */}
					<UserAvatar source={{ uri: 'https://xesque.rocketseat.dev/users/avatar/profile-7b68609b-d390-4141-a4be-e76298f3ab35.jpg'}} />
				</ProfileButton>
			</Header>

			<ProvidersList 
				keyExtractor={providers => providers.id}
				data={providers}
				renderItem={({item: provider}) => (
					<ProviderContainer>
						<ProviderAvatar source={{uri: 'https://xesque.rocketseat.dev/users/avatar/profile-7b68609b-d390-4141-a4be-e76298f3ab35.jpg'}} />
						<ProviderInfo>
							
							<ProviderName>{provider.name}</ProviderName>

							<ProviderMeta>
								<Icon name="calendar" color="#ff9000" size={14}/>
								<ProviderMetaText>Segunda à sexta</ProviderMetaText>
							</ProviderMeta>

							<ProviderMeta>
								<Icon name="clock" color="#ff9000" size={14}/>
								<ProviderMetaText>8h às 18h</ProviderMetaText>
							</ProviderMeta>

						</ProviderInfo>
					</ProviderContainer>
				)}
			/> 
		</Container>
	)
}

export default Dashboard;
