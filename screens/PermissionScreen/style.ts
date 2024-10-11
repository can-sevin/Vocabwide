import styled from "styled-components/native";
import { Colors } from "../../config";

export const Container = styled.SafeAreaView`
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  background-color: ${Colors.purple};
`;

export const ContainerPermission = styled.View`
  align-items: center;
  justify-content: space-between;
  height: 140px;
  margin-top: 36px;
`;

export const HeaderText = styled.Text`
  font-size: 48px;
  align-self: center;
  text-align: center;
  color: #fff;
  font-family: Helvetica-Bold;
  margin-top: 48px;
  margin-bottom: 36px;
`;

export const SmallText = styled.Text`
  font-size: 18px;
  align-self: center;
  text-align: center;
  color: #fff;
  font-family: Helvetica-Medium;
`;

export const Icons = styled.Image`
  height: 64px;
  width: 64px;
`;

export const BtnNext = styled.TouchableOpacity`
  height: 48px;
  width: 160px;
  background-color: ${Colors.liliac};
  border-radius: 12px;
  margin-top: 32px;
  align-items: center;
  justify-content: center;
  align-self: center;
`;
