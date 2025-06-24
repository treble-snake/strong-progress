import React, {useState} from "react";
import {
  ParsingSettingsModal
} from "@/components/progressive-overload/ParsingSettingsModal";
import {Button, Tooltip} from "antd";
import {SettingOutlined} from "@ant-design/icons";

export function GlobalSettings() {
  const [isParsingModalOpen, setIsParsingModalOpen] = useState(false);
  const openParsingModal = () => setIsParsingModalOpen(true);
  const closeParsingModal = () => setIsParsingModalOpen(false);

  return <>
    <ParsingSettingsModal isOpen={isParsingModalOpen}
                          onClose={closeParsingModal}/>
    <Tooltip title={'Settings'}>
      <Button icon={<SettingOutlined/>} onClick={openParsingModal}/>
    </Tooltip>
  </>
}