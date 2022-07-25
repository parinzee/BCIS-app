import { StyleSheet, View, FlatList, RefreshControl } from "react-native";
import PortfolioItem from "../components/PortfolioItem";
import useLayout from "../hooks/useLayout";
import { ActivityIndicator, Colors, Title } from "react-native-paper";
import { useGetPortfoliosQuery } from "../slices/apiSlice";
import useTheme from "../hooks/useTheme";
import SignupBenefits from "../components/SignupBenefits";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function PortfolioScreen() {
  const layout = useLayout();
  const itemImageBackground = useTheme().colors.backdrop;
  const itemWidth = layout.isSmallDevice ? 315 : 350;

  const userEmail = useSelector((state: RootState) => state.user.email);

  const {
    data: portfolios,
    isLoading,
    isSuccess,
    isError,
    isFetching,
    refetch,
  } = useGetPortfoliosQuery();

  let content;

  if (userEmail == null) {
    content = <SignupBenefits />;
  } else if (isLoading) {
    content = (
      <ActivityIndicator
        color={Colors.blue300}
        size={layout.isLargeDevice ? 70 : 40}
      />
    );
  } else if (isSuccess) {
    content = (
      <FlatList
        // Specify an arbitary key to force FlatList refresh
        // when layout.isNotSmallDevice may change when rotating screens
        key={layout.isMediumDevice || layout.isLargeDevice ? "@" : "!"}
        data={portfolios}
        numColumns={layout.isMediumDevice || layout.isLargeDevice ? 2 : 1}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            tintColor={Colors.blue300}
            colors={[Colors.blue300]}
            // Add timeout to ease the pull-to-refresh
            onRefresh={refetch}
          />
        }
        renderItem={({ item }) => (
          <PortfolioItem
            title={item.title}
            content={item.content}
            dateUpdated={new Date(item.date_updated)}
            imageURL={item.image_URL}
            width={itemWidth}
            imageBackground={itemImageBackground}
          />
        )}
        style={{ width: layout.window.width }}
        contentContainerStyle={{ alignItems: "center" }}
      />
    );
  } else if (isError) {
    content = <Title>Unable to get News</Title>;
  }

  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
