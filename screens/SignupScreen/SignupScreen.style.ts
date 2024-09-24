import styled from "styled-components/native"
import { Colors } from "../../config";
import { Dimensions } from "react-native";

const windowHeight = Dimensions.get('window').height; 

export const LoginLayout = styled.View`
    flex: 1;
    justifyContent: space-between;
`;

export const SignupLayout = styled(LoginLayout)`
    justifyContent: flex-end;
`;

export const LoginHeaderText = styled.Text`
    fontSize: 28px;
    color: ${Colors.white};
    fontFamily: Helvetica-Bold;
    alignSelf: center;
    marginTop: 128px;
`;

export const SignupHeaderText = styled(LoginHeaderText)`
    marginBottom: 110px;
    marginTop: 0px;
`;

export const LoginLayoutInside = styled.View`
    backgroundColor: ${Colors.whiteLight};
    borderRadius: 16px;
    alignSelf: center;
    justifyContent: center;
    alignContent: center;
    width: 100%;
    height: ${windowHeight * 0.55};
    marginTop: 64px;
    padding: 32px;
`;

export const SignupLayoutInside = styled(LoginLayoutInside)`
    backgroundColor: ${Colors.whiteLight};
    borderRadius: 16px;
    alignSelf: center;
    justifyContent: flex-start;
    alignContent: flex-start;
    width: 100%;
    height: ${windowHeight * 0.55};
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

export const LoginBtmText = styled.Text`
    fontFamily: Helvetica-Medium; 
    fontSize: 16px; 
    alignSelf: center; 
    marginTop: 12px;
`;

