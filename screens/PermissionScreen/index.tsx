import React, { useEffect, useState } from "react";
import { ImageBackground } from "react-native";

import { getPermissions, handleOpenAppSettings } from "../../utils";
import { Images } from "../../config";
import { PermissionComponent } from "../../components/PermissionComponent";
import { BtnNext, Container, HeaderText, SmallText } from "./style";

export const PermissionScreen = ({ navigation }) => {
  const [voicePermission, setVoicePermission] = useState<"granted" | "denied">(
    "denied"
  );
  const [camPermission, setCamPermission] = useState<"granted" | "denied">(
    "denied"
  );

  useEffect(() => {
    const fetchPermissions = async () => {
      const voice = await getPermissions("voice");
      const cam = await getPermissions("camera");
      setVoicePermission(voice);
      setCamPermission(cam);
    };

    fetchPermissions();
  }, []);

  return (
    <ImageBackground
      source={Images.background}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <Container>
        <HeaderText>Welcome to Vocabwide</HeaderText>

        <PermissionComponent
          permissionType="voice"
          permissionStatus={voicePermission}
          onPress={handleOpenAppSettings}
        />

        <PermissionComponent
          permissionType="camera"
          permissionStatus={camPermission}
          onPress={handleOpenAppSettings}
        />

        {voicePermission === "granted" && camPermission === "granted" && (
          <BtnNext onPress={() => navigation.navigate("Login")}>
            <SmallText>Press for Login</SmallText>
          </BtnNext>
        )}
      </Container>
    </ImageBackground>
  );
};
