import React from "react";
import { Icon } from "../Icon/Icon";
import { Colors } from "../../config";
import { InputContainer, StyledTextInput, IconButton } from "./style";

export const TextInput = ({
  width = "100%",
  leftIconName,
  rightIcon,
  errorState,
  handlePasswordVisibility,
  ...otherProps
}) => {
  return (
    <InputContainer width={width} errorState={errorState}>
      <StyledTextInput
        placeholderTextColor={Colors.mediumGray}
        {...otherProps}
      />
      {rightIcon ? (
        <IconButton onPress={handlePasswordVisibility}>
          <Icon name={rightIcon} size={22} color={Colors.mediumGray} style={undefined} />
        </IconButton>
      ) : null}
    </InputContainer>
  );
};