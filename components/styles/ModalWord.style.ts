import styled from "styled-components/native";
import { Colors } from "../../config";

export const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContent = styled.View`
  width: 300px;
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  align-items: center;
`;

export const ModalText = styled.Text`
  font-size: 20px;
  margin-bottom: 20px;
`;

export const SaveButton = styled.TouchableOpacity`
  background-color: ${Colors.main_yellow};
  padding: 12px;
  border-radius: 8px;
`;

export const SaveButtonText = styled.Text`
  color: white;
  font-family: Helvetica-Medium;
`;

export const CancelButton = styled.TouchableOpacity`
  background-color: red;
  padding: 12px;
  border-radius: 8px;
`;

export const CancelButtonText = styled.Text`
  color: white;
  font-family: Helvetica-Medium;
`;

export const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 80%;
`;
