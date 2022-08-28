import * as React from 'react';
import { useModel, useObservable } from "kyoka";
import { Model } from "../model";

interface IconProps {
  name: string;
}

export default function Icon(props: IconProps) {
  const model = useModel<Model>();
  const assets = useObservable(model.assets);

  return <div className="icon" dangerouslySetInnerHTML={{ __html: assets[props.name] }} />;
}