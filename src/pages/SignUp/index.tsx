import React, { useRef, useCallback } from 'react';

import { 
	Image, 
	KeyboardAvoidingView, 
	Platform, 
	View, 
	ScrollView,
	TextInput,
	Alert
} from 'react-native';

import api from '../../service/api';

import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import getValidationsErrors from '../../utils/getValidationsErrors';
import Input from '../../components/input';
import Buttom from '../../components/button';

import { Container, Title, BackToSignIn, BackToSignInText } from './styles';

import logoImg from '../../assets/logo.png';

interface SignUpFormData {
	name: string;
	email: string; 
	password: string;
}

const SignUp: React.FC = () => {
	const FormRef = useRef<FormHandles>(null);
	const navigation = useNavigation();

	const emailInputRef = useRef<TextInput>(null);
	const passwordInputRef = useRef<TextInput>(null);

	const handleSignUp = useCallback( async ( data: SignUpFormData ) => {
		try{
			FormRef.current?.setErrors({});

			const schema = Yup.object().shape({
				name: Yup.string()
					.required('Nome obrigatório'),
				email: Yup.string()
					.required('Email obrigatório')
					.email('Digite um email válido'),
				password: Yup.string()
					.min(6, 'Mínimo de 6 caracteres')
			})

			await schema.validate(data, {
				abortEarly: false, // retorna todos os erros, com true ele retorno uma por vez
			});

			await api.post('/users', data);

			Alert.alert('Cadastro efetuado com sucesso', 'Bem vindo');
			navigation.goBack();
			

		}catch(err) {
			console.log(err);
			if(err instanceof Yup.ValidationError) {
				const errors = getValidationsErrors(err);
				FormRef.current?.setErrors(errors);
				return;
			}

			Alert.alert(
				'Erro no cadastro',
				'Ocorreu um erro ao fazer o cadastro, tente novamente'
			);
		}
	}, [navigation]); 

	return (
		<>
			<KeyboardAvoidingView 
				style={{flex: 1}}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				enabled
				>
				<ScrollView 
					contentContainerStyle={{ flex: 1}}
					keyboardShouldPersisTaps="handled"
					>

					<Container>
						<Image source={logoImg} />
						<View>
							<Title>Crie sua conta</Title>
						</View>
						
						<Form ref={FormRef} onSubmit={handleSignUp}>
							
							<Input 
								autoCapitalize="words"
								name="name" 
								icon="user" 
								placeholder="Name" 
								returnKeyType="next"
								onSubmitEditing={() => {
									emailInputRef.current.focus();
								}}
							/>
							
							<Input 
								ref={emailInputRef}
								keyboardType="email-address"
								autoCorrect={false}
								autoCapitalize="none"
								name="email" 
								icon="mail" 
								placeholder="E-mail" 
								returnKeyType="next"
								onSubmitEditing={() => {
									passwordInputRef.current.focus();
								}}
							/>

							<Input 
								ref={passwordInputRef}
								name="password" 
								icon="lock"  
								placeholder="Senha" 
								secureTextEntry
								textContentType="newPassword"
								returnKeyType="send"
								onSubmitEditing={() => FormRef.current?.submitForm()}
							/>

							<Buttom onPress={() => FormRef.current?.submitForm()}>Criar Conta</Buttom>
						</Form>

					</Container>

					<BackToSignIn onPress={() => navigation.goBack()}>
						<Icon name="arrow-left" size={20} color="#FFF"/>
						<BackToSignInText>Voltar para logon</BackToSignInText>
					</BackToSignIn>
				</ScrollView>

			</KeyboardAvoidingView>
		</>
	)
}

export default SignUp;
