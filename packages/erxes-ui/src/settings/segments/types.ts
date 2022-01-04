import { QueryResponse } from '@erxes/ui/src/types';

export interface IEvent {
  name: string;
  attributeNames: string[];
}

export interface IConditionFilter {
  segmentKey?: string;
  key?: string;
  name: string;
  operator: string;
  value: string;
}
export interface ISegmentCondition {
  key?: string;
  type: string;

  propertyName?: string;
  propertyOperator?: string;
  propertyValue?: string;
  propertyType?: string;

  eventName?: string;
  eventOccurence?: string;
  eventOccurenceValue?: number;
  eventAttributeFilters?: IConditionFilter[];

  subSegmentId?: string;

  boardId?: string;
  pipelineId?: string;

  formId?: string;
}

export interface ISegmentMap {
  _id?: string;
  key: string;
  contentType: string;
  pipelineId?: string;
  conditions: ISegmentCondition[];
  conditionsConjunction: string;
}

export interface ISubSegment {
  contentType: string;
  conditionsConjunction?: string;
  conditions?: ISegmentCondition[];
}

export interface IConditionsForPreview {
  type: string;
  subSegmentForPreview: ISegmentMap;
}
export interface ISegmentWithConditionDoc {
  name: string;
  description: string;
  subOf: string;
  color: string;
  conditions: ISegmentCondition[];
}

export interface ISegmentDoc {
  name: string;
  contentType?: string;
  description: string;
  color: string;
  conditions: ISegmentCondition[];
  subOf: string;
  subSegments?: ISubSegment[];
  conditionsConjunction: string;
  boardId: string;
  pipelineId: string;
  shouldWriteActivityLog: boolean;
}

export interface ISegment extends ISegmentDoc {
  _id: string;
  contentType: string;
  conditionsConjunction: string;
  getSubSegments: ISegment[];
  subSegmentConditions: ISegment[];
  getParentSegment: ISegment;
}

export type SegmentsQueryResponse = {
  segments: ISegment[];
} & QueryResponse;

export type HeadSegmentsQueryResponse = {
  segmentsGetHeads: ISegment[];
} & QueryResponse;

// mutation types
export type AddMutationVariables = {
  name: string;
  description: string;
  subOf: string;
  color: string;
  conditions: ISegmentCondition[];
};

export type AddMutationResponse = {
  segmentsAdd: (params: { variables: AddMutationVariables }) => Promise<any>;
};
