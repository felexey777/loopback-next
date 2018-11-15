// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject} from '@loopback/context';
import {json} from 'body-parser';
import {is} from 'type-is';
import {RestBindings} from '../keys';
import {Request, RequestBodyParserOptions} from '../types';
import {
  BodyParserMiddleware,
  getParserOptions,
  invokeBodyParserMiddleware,
} from './body-parser.helpers';
import {BodyParser, RequestBody} from './types';

export class JsonBodyParser implements BodyParser {
  name = 'json';
  private jsonParser: BodyParserMiddleware;

  constructor(
    @inject(RestBindings.REQUEST_BODY_PARSER_OPTIONS, {optional: true})
    options: RequestBodyParserOptions = {},
  ) {
    const jsonOptions = getParserOptions('json', options);
    this.jsonParser = json(jsonOptions);
  }

  supports(mediaType: string) {
    return !!is(mediaType, '*/json', '*/*+json');
  }

  async parse(request: Request): Promise<RequestBody> {
    const body = await invokeBodyParserMiddleware(this.jsonParser, request);
    return {value: body};
  }
}
