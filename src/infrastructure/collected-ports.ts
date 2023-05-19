import { SharedPorts } from '../shared-ports';
import { Queries } from '../shared-read-models';
import { ExternalQueries } from '../types/external-queries';

export type CollectedPorts = SharedPorts & Queries & ExternalQueries;
