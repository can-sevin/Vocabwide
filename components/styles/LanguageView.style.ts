import styled from "styled-components/native";
import { Colors } from "../../config";

export const LanguageScrollView = styled.ScrollView`
  max-height: 280px;
`;

export const LanguageInsideAlphabetView = styled.View`
  background-color: ${Colors.LighterGray2};
  padding: 4px;
`;

export const LanguageInsideView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  background-color: ${Colors.LighterGray5};
  padding-horizontal: 16px;
`;

export const LanguageInsiderView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
  margin-vertical: 2px;
  margin-horizontal: 12px;
`;

export const LanguageInsiderText = styled.Text`
  color: ${Colors.black};
  font-size: 16px;
  font-family: Helvetica-Medium;
  text-align: center;
`;

export const LanguageInsideAlphabetText = styled.Text`
  color: ${Colors.white};
  font-size: 24px;
  font-family: Helvetica-Bold;
  margin-horizontal: 8px;
`;
