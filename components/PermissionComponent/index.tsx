import React from "react";
import { TouchableOpacity } from "react-native";
import { Images } from "../../config";
import { ContainerPermission, Icons, SmallText } from "./style";

interface PermissionComponentProps {
  permissionType: "camera" | "voice";
  permissionStatus: "granted" | "denied";
  onPress: () => void;
}

export const PermissionComponent: React.FC<PermissionComponentProps> = ({
  permissionType,
  permissionStatus,
  onPress,
}) => {
  const isGranted = permissionStatus === "granted";
  const iconSource =
    permissionType === "camera" ? Images.cam_icon : Images.mic_icon;
  const successIcon = Images.succeed_icon;
  const message = isGranted
    ? `You had gave ${
        permissionType === "camera" ? "Camera" : "Voice"
      } Permission`
    : `Give ${
        permissionType === "camera" ? "Camera" : "Voice"
      } Permission in app settings`;

  return (
    <ContainerPermission>
      {isGranted ? (
        <>
          <Icons source={successIcon} />
          <SmallText>{message}</SmallText>
        </>
      ) : (
        <>
          <TouchableOpacity onPress={onPress}>
            <Icons source={iconSource} />
          </TouchableOpacity>
          <SmallText>{message}</SmallText>
        </>
      )}
    </ContainerPermission>
  );
};
