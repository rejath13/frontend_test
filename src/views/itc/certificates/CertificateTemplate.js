import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  pdf
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  main: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  wrapper : {
    marginTop : '23%'
  },
  contentContainer: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  col4: {
    width: "33.33%",
    paddingRight: 5,
  },
  col8: {
    width: "66.67%",
  },
  label: {
    fontWeight: "bold",
    fontSize : 14
  },
  sign: {
    width: 300,
    height: 'auto',
    position : 'absolute',
    zIndex : 1,
    left : 300,
    top : 300,
    objectFit : 'contain'
  },
  bgImageWrapper: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },
  bgImage: {
    height: "100%",
    width: "100%",
    objectFit: "fill",
  },
});

const CertificateTemplate = (props) => {

  const {certificateFields = []} = props;

  console.log('certificateFields',certificateFields)

  return (
    <Document>
      <Page size="A4" orientation="landscape">
        <View style={styles.bgImageWrapper}>
          <Image style={styles.bgImage} source={require("./Final-Certificate-for-asateel.png").default} />
        </View>
        <View style={styles.main}>
        <View style={styles.contentContainer}>
            <View style={styles.row}>
            <View style={styles.col4}></View>
            <View style={{...styles.col8,...styles.wrapper}}>
                {
                    certificateFields.map((field,index) => <View key={index} style={styles.row}>
                        <View style={styles.col4}>
                        <Text style={styles.label}>{field.name}</Text>
                        </View>
                        <View style={styles.col8}>
                        <Text style={styles.label}>: &nbsp;{field.value}</Text>
                        </View>
                </View>)
                }
                
            </View>
            </View>
        </View>
        </View>

        {/* Sign */}
        {/* <Image style={styles.sign} source={require("./sign.png").default} /> */}
      </Page>
    </Document>
  );
};

export default CertificateTemplate;
