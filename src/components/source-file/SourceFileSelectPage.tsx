import {Empty} from "antd";
import React from "react";
import {SourceFileUpload} from "@/components/source-file/SourceFileUpload";

export function SourceFileSelectPage() {
  return (
    <Empty
      description={'Select a file to import your Strong app data'}>
      <SourceFileUpload/>
    </Empty>
  );
}