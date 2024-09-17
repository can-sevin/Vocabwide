import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from '../components';
import { BottomTextWhite, HomeBtmIconText, SignupKeyboardAvoiding } from '../styles/HomeScreen';
import { Colors } from '../config';
import { Formik } from 'formik';
import * as Yup from 'yup'; // Import Yup for validation
import { signupValidationSchema } from '../utils'; // Adjust if needed
import { ScrollView } from 'react-native-gesture-handler';

export const background = require('../assets/background_img.jpg');
const back_icon = require("../assets/icons/back.png");

// Custom validation schema for word input
const wordValidationSchema = Yup.object().shape({
  words: Yup.string()
    .matches(/^\S+(\s\S+)+$/, "Please enter multiple words separated by spaces")
    .required('Words input is required'),
});

export const InputScreen = ({ navigation }) => {

  const hadnleAddingWords = async (values: { words: string }) => {
    const { words } = values;
    // Logic to handle words input
    console.log("Entered words: ", words);
    // Add your desired logic here...
  };

  return (
    <ImageBackground source={background} style={styles.container} resizeMode="cover" blurRadius={6}>
      <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => navigation.goBack()}>
        <Image style={{width: 36, height: 36, marginLeft: 20, marginTop: 20}} source={back_icon} />  
      </TouchableOpacity>
      <Text style={styles.header_text}>Input Page</Text>
      <View style={{ marginTop: 128 }}>
        <Formik
          initialValues={{
            words: "", // Add words field for input
          }}
          validationSchema={wordValidationSchema} // Apply word validation schema
          onSubmit={(values) => hadnleAddingWords(values)}
        >
          {({
            values,
            touched,
            errors,
            handleChange,
            handleSubmit,
            handleBlur,
          }) => (
            <SignupKeyboardAvoiding enableOnAndroid={true}>
              {/* Input fields */}
              <TextInput
                name="words"
                placeholder="Enter words"
                autoCapitalize="none"
                keyboardType="default"
                autoFocus={true}
                value={values.words} // Bind formik value
                onChangeText={handleChange("words")} // Handle input change
                onBlur={handleBlur("words")} // Handle blur event
              />
              <BottomTextWhite style={{ textAlign: 'center', marginVertical: 12 }}>
                If you want to add multiple words, please separate each word with a space.
              </BottomTextWhite>      
            </SignupKeyboardAvoiding>
          )}
        </Formik>
        <Text style={styles.header_text}>Last Added Words</Text>
        <ScrollView style={{paddingVertical: 8}}>
          <BottomTextWhite style={{marginVertical: 8}}>Deneme</BottomTextWhite>
          <BottomTextWhite style={{marginVertical: 8}}>Deneme</BottomTextWhite>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: "flex-start", 
    alignItems: "center",
  },
  header_text: {
    fontSize: 32,
    paddingTop: 48,
    alignSelf: "center",
    justifyContent: "flex-start",
    textAlign: "center",
    color: Colors.white,
    fontFamily: "Helvetica-Bold",
  },
});

export default InputScreen;
