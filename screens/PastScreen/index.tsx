import React, { useState } from "react";
import { SafeAreaView, View, Text, ActivityIndicator } from "react-native";
import { Colors } from "../../config"; // Renkler için config dosyanız varsa
import { LanguageViewPast } from "../../components/LanguageViewPast"; // Önceden oluşturduğunuz bileşeni buraya import edin
import { useNavigation } from "@react-navigation/native";

type PastScreenProps = {
  route: {
    params: {
      uid: string;
      mainFlag: string;
      targetFlag: string;
    };
  };
};

export const PastScreen: React.FC<PastScreenProps> = ({ route }) => {
  const { uid, mainFlag, targetFlag } = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [wordDeleted, setWordDeleted] = useState(false);

  const handleWordDeleted = () => {
    setWordDeleted((prev) => !prev); // State değişikliği, `LanguageViewPast`'i günceller
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <View style={{ flex: 1, padding: 16 }}>
        {/* Header */}
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{ fontSize: 24, fontWeight: "bold", color: Colors.black }}
          >
            Past Words
          </Text>
          <Text style={{ fontSize: 16, color: Colors.gray }}>
            Here you can find words you have already learned.
          </Text>
        </View>

        {/* LanguageViewPast */}
        {loading ? (
          <ActivityIndicator size="large" color={Colors.main_yellow} />
        ) : (
          <LanguageViewPast
            uid={uid}
            mainFlag={mainFlag}
            targetFlag={targetFlag}
            setLoading={setLoading}
            loading={loading}
            onWordDeleted={handleWordDeleted}
          />
        )}

        {/* Go Back Button */}
        <View style={{ marginTop: 16 }}>
          <Text
            style={{
              color: Colors.main_yellow,
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 16,
            }}
            onPress={() => navigation.goBack()}
          >
            Go Back
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PastScreen;