import styled from "styled-components/native";
import { Colors } from "../../config";

export const InputContainer = styled.View<{ width: string; errorState: boolean }>`
  background-color: ${Colors.white};
  border-radius: 12px;
  flex-direction: row;
  padding: 12px;
  margin-bottom: 16px;
  width: ${(props) => props.width};
  border-width: 1px;
  border-color: ${(props) =>
    props.errorState ? Colors.red : Colors.mediumGray};
`;

export const StyledTextInput = styled.TextInput`
  flex: 1;
  width: 100%;
  font-size: 16px;
  color: ${Colors.black};
  font-family: "Helvetica-Medium";
`;

export const IconButton = styled.TouchableOpacity`
  margin-right: 10px;
`;