Bacterial rosegarden
====================
Authors: [Damir Melnikov](mailto:damir.melnikov@gmail.com), [Tanya Bibikova](mailto:tm@datalaboratory.ru)


Bacterial rosegarden is a tool for metagenomic phylogeny visualization. The tool was implemented mostly in JavaScript using [d3.js](http://d3js.org/) library. The tool was used in [Russian Metagenomic project](http://metagenome.ru/en).

Project description
-------------------
There are two branches: `hyphen` (default) and `circles` with slightly different visual layout.


In Bacterial rosegarden three types of data are used: distance matrices, bacterial phylogeny metainformation and sample metainformation.

Distance matrix is a matrix of all pairwise sample-to-sample distances.

Example:

 | sample_name_1 | sample_name_2 | sample_name_3
--- | --- | --- | ---
 **sample_name_1** | 0.0 | 0.01 | 0.02
 **sample_name_2** | 0.01 | 0.0 | 0.015
 **sample_name_3** | 0.02 | 0.015 | 0.0 

 Bacterial phylogeny metainformation example:

phylum | class | order | family | genus | org
--- | --- | --- | --- | --- | --- 
Verrucomicrobia | Verrucomicrobiae | Verrucomicrobiales | Verrucomicrobiaceae | Akkermansia | Akkermansia_muciniphila_ATCC_BAA_835"
Bacteroidetes | Bacteroidia | Bacteroidales | Rikenellaceae | Alistipes | Alistipes_indistinctus_YIT_12060
Bacteroidetes | Bacteroidia | Bacteroidales | Rikenellaceae | Alistipes | Alistipes_onderdonkii_DSM_19147
Firmicutes | Clostridia | Clostridiales | Clostridiaceae | Coprococcus | Clostridium_sp_L2_50


Sample metainformation can contain any information but fields `sample_name`, `country`,`country_full_name` and  `subj_id` are required. `subj_id` is a patient identidification number. This number can be the same for different samples in case time-series data.

Sample metainformation example:

sample_name | country | country_full_name | region | subj_id
--- | --- | --- | --- | ---
sample_1 | RUS | Russia | Moscow | 1
sample_2 | RUS | Russia | Moscow | 1
sample_3 | RUS | Russia | Saint-Petersburg | 2
sample_4 | USA | USA | New-York | 3


License
-----
Copyright (c) 2014, Damir Melnikov, Tanya Bibikova

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
