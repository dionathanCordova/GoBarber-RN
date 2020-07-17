import React, { useCallback, useRef } from 'react';

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

import { useAuth } from '../../hooks/AuthContext';

import Input from '../../components/input';
import Buttom from '../../components/button';

import * as Yup from 'yup';
import getValidationsErrors from '../../utils/getValidationsErrors';

import { 
	Container, 
	Title, 
	ForgotPassword, 
	ForgotPasswordText, 
	CreateAccountButton, 
	CreateAccountButtonText 
} from './styles';

import logoImg from '../../assets/logo.png';

interface SignInFormData {
	email: string;
	password: string;
}

const SignIn: React.FC = () => {
	const formRef = useRef<FormHandles>(null);
	const passwordInputRef = useRef<TextInput>(null)
	const navigation = useNavigation();

	const { signIn, user } = useAuth();

	const handleSignIn = useCallback( async ( data: SignInFormData ) => {
		
		try{

			alert(data);
			formRef.current?.setErrors({});
		
			const schema = Yup.object().shape({
				email: Yup.string().required('Email obrigatório').email('Digite um email válido'),
				password: Yup.string().min(6, 'Senha obrigatória')
			})

			await schema.validate(data, {
				abortEarly: false, // retorna todos os erros, com true ele retorno uma por vez
			});
			
			await signIn({
				email: data.email,
				password: data.password
			})

			// navigation.goBack();
			// history.push('/dashboard');

		}catch(err) {
			if(err instanceof Yup.ValidationError) {
				const errors = getValidationsErrors(err);
				formRef.current?.setErrors(errors);
			}
			console.log('teste:' + err);
		
			// disparar toast
			Alert.alert(
				'Erro na autenticação', 
				'Ocorreu um erro ao fazer login, cheque as credenciais'
			);

		}
	}, [signIn]); 

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
							<Title>Faça seu Logon</Title>
						</View>

						<Form ref={formRef} onSubmit={handleSignIn}>
							
							<Input 
								autoCorrect={false}
								autoCapitalize="none"
								keyboardType="email-address"
								name="email" 
								icon="mail" 
								placeholder="E-mail" 
								returnKeyType="next"
								onSubmitEditing={() => {

								}}
							/>
							
							<Input 
								ref={passwordInputRef}
								name="password" 
								icon="lock"  
								placeholder="Senha" 
								secureTextEntry
								returnKeyType="send"
								onSubmitEditing={() => {formRef.current?.submitForm()}}
							/>
							
							<Buttom onPress={() => {formRef.current?.submitForm()}}>Entrar</Buttom>

							<ForgotPassword onPress={() => {}}>
								<ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
							</ForgotPassword>
						</Form>
					</Container>

					<CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
						<Icon name="log-in" size={20} color="#ff9000"/>
						<CreateAccountButtonText>Crie sua conta</CreateAccountButtonText>
					</CreateAccountButton>
				</ScrollView>

			</KeyboardAvoidingView>
		</>
	)
}

export default SignIn;
