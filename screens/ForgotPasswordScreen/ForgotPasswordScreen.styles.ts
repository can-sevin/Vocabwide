import styled from 'styled-components/native';
import { Dimensions } from "react-native";
import { Colors } from "../../config";

const windowHeight = Dimensions.get('window').height; 

export const ForgotPasswordLayout = styled.View`
    flex: 1;
    justifyContent: space-between;
`;

export const HeaderTextForgotPasswordLayout = styled.View`
    flex: 1;
    justifyContent: center;
`;

export const ForgotPasswordHeaderText = styled.Text`
    fontSize: 28px;
    color: ${Colors.white};
    fontFamily: Helvetica-Bold;
    alignSelf: center;
`;

export const ForgotPasswordLayoutInside = styled.View`
    backgroundColor: ${Colors.whiteLight};
    borderRadius: 16px;
    alignSelf: center;
    justifyContent: space-around;
    alignContent: center;
    width: 100%;
    height: ${windowHeight * 0.38};
    padding: 32px;
`;

export const GeneralButton = styled.TouchableOpacity`
    width: 100%;
    justifyContent: center;
    alignItems: center;
    alignSelf: flex-end;
    marginTop: 40px;
    backgroundColor: ${Colors.LighterGray2};
    padding: 10px;
    borderRadius: 8px;
`;

export const GeneralButtonText = styled.Text`
    fontSize: 20px;
    color: ${Colors.white};
    fontWeight: 700;
`;

export const ForgotPasswordBtmText = styled.Text`
    fontFamily: Helvetica-Medium; 
    fontSize: 16px; 
    alignSelf: center; 
    marginTop: 12px;
`;