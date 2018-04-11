#!/usr/bin/env python2

"""
Generates the interaction model using the SWBD utterances.
"""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import os
import sys
import argparse
import re
import json

from swda import Transcript
from swda import CorpusReader

def main():
    cmdline_parser = argparse.ArgumentParser(
        description=__doc__
    )
    cmdline_parser.add_argument(
        '--swda_basedir',
        required=True,
        help='SWDA basedir'
    )
    cmdline_parser.add_argument(
        '--model_json',
        required=True,
        help='output model json file'
    )
    args = cmdline_parser.parse_args()

    all_utterances = set()
    corpus = CorpusReader(args.swda_basedir)
    for trans in corpus.iter_transcripts(display_progress=False):
        list_utterance = []
        for utt in trans.utterances:
            tokens = utt.pos_lemmas(wn_lemmatize=False)
            list_word = []
            for token in tokens:
                # skip punctuation by checking the POS tag.
                if not re.match(r'^[a-zA-Z]', token[1]):
                    continue
                list_word.append(token[0].lower())
            if not list_word:
                # ignore empty utterance
                continue
            utterance = ' '.join(list_word)
            if len(utterance) > 140:
                # Amazon has a limit of 140 character for slot values
                continue
            list_utterance.append(utterance)
        all_utterances |= set(list_utterance)
        # only keep first 1000 unique utterances
        if len(all_utterances) > 1000:
            break
    print('\nextracted {} unique utterances'.format(len(all_utterances)))

    language_model = {
        'invocationName': 'lab two',
        'intents': [
            {
                'name': 'ConverseIntent',
                'slots': [
                    {
                        'name': 'Text',
                        'type': 'TEXT'
                    }
                ],
                'samples': [
                    '{Text}'
                ]
            }
        ],
        'types': [
            {
                'name': 'TEXT',
                'values': [
                    {
                        'name': {
                            'value': utt
                        }
                    }
                    for utt in all_utterances
                ]
            }
        ]
    }

    interaction_model = {
        'interactionModel': {
            'languageModel': language_model
        }
    }

    json.dump(
        interaction_model,
        open(args.model_json, 'w'),
        indent=2
    )

if __name__ == '__main__':
    main()
