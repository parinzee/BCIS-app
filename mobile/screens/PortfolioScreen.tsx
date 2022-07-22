import { StyleSheet, View } from "react-native";
import PortfolioItem from "../components/PortfolioItem";

export default function PortfolioScreen() {
  return (
    <View style={styles.container}>
      <PortfolioItem
        title="Parin Received 1st Place at AI Builders"
        content="Congratulations to **Parinthapat Pengpun** for receiving the first place award. More details about [that here](https://github.com/parinzee)!"
        dateUpdated={new Date()}
        width={350}
        imageURL="https://scontent.fbkk13-3.fna.fbcdn.net/v/t39.30808-6/294644472_5203052613103738_1373095766086075602_n.jpg?stp=cp1_dst-jpg&_nc_cat=110&ccb=1-7&_nc_sid=8bfeb9&_nc_eui2=AeF27_OLE3oasOlFTpXevnSBthCT-xEB-r22EJP7EQH6vVCw-qH4EbApSb92NLQPpJI0KGYCQUGil4S5HndAESdP&_nc_ohc=WHwMLqUU7HgAX9qWMj_&_nc_ht=scontent.fbkk13-3.fna&oh=00_AT8PFObvNqQJWJJuSjsD-u7qV29Mv4Pp5ZhzPWyBM4m7QA&oe=62DE4EC7"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
