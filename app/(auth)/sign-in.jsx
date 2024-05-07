import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link } from "expo-router";
import { getCurrerntUser, signIn } from "../../lib/appwrite";
import { router } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
const SignIn = () => {
 const { setUser, setIsLoggedIn } = useGlobalContext();

 const submit = async () => {
  if (!form.email || !form.password) {
   Alert.alert("Error", "Please Fill in all the fields");
  }
  setIsSubmitting(true);
  try {
   await signIn(form.email, form.password);
   const result = await getCurrerntUser();
   setUser(result);
   setIsLoggedIn(true);
   router.replace("/home");
  } catch (error) {
   Alert.alert("Error", error.message);
  } finally {
   setIsSubmitting(false);
  }
 };
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [form, setForm] = useState({
  email: "",
  password: "",
 });
 return (
  <SafeAreaView className='bg-primary h-full'>
   <ScrollView>
    <View className='w-full justify-center min-h-[83vh] px-4 my-6'>
     <Image
      source={images.logo}
      resizeMode='contain'
      className='w-[115px] h-[35px]'
     />
     <Text className='text-2xl text-white text-semibold mt-10 font-psemibold'>
      Log In To Aora
     </Text>
     <FormField
      title='Email'
      value={form.email}
      handleChangeText={(e) => setForm({ ...form, email: e })}
      otherStyles='mt-7'
      keyboardType='email-address'
     />
     <FormField
      title='Password'
      value={form.password}
      handleChangeText={(e) => setForm({ ...form, password: e })}
      otherStyles='mt-7'
     />
     <CustomButton
      title='Sign In'
      handlePress={submit}
      containerStyles='mt-7'
      isLoading={isSubmitting}
     />
     <View className='justify-center pt-5 flex-col items-center gap-2'>
      <Text className='text-lg text-gray-100 font-pregular'>
       Don't have Account?
      </Text>
      <Link
       className='text-lg font-psemibold text-secondary-100'
       href='/sign-up'
      >
       Sign Up
      </Link>
     </View>
    </View>
   </ScrollView>
  </SafeAreaView>
 );
};

export default SignIn;
