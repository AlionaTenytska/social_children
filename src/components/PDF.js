import React from "react";
import { Document, Page, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
});

const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
     
    </Page>
  </Document>
);

export default MyDocument;
