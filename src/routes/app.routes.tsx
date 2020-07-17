import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Dashboard from '../pages/Dashboards';
import Profile from '../pages/Profile';
import CreateAppointment from '../pages/CreateAppointment';
import AppointmentCreated from '../pages/AppointmentCreated';

const App = createStackNavigator();

const AppRoutes: React.FC = () => (
	<App.Navigator
		screenOptions={{
			headerShown: false,
			cardStyle: { backgroundColor: '#312e38'}
		}}
		>
		<App.Screen name="cashboard" component={Dashboard}/>
		<App.Screen name="createAppointment" component={CreateAppointment} />
		<App.Screen name="appointmentCreated" component={AppointmentCreated} />
		
		<App.Screen name="profile" component={Profile} />
	</App.Navigator>
)

export default AppRoutes;
