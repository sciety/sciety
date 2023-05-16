import { SharedPorts } from '../shared-ports';
import { Queries } from '../shared-read-models';
import { ExternalQueries } from '../third-parties';

export type CollectedPorts = SharedPorts & Queries & ExternalQueries;
