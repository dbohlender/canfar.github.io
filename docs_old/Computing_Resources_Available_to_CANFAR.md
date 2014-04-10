Most CANFAR resources are available on ComputeCanada resources, though Westgrid. If you want to use the resources on a specific cluster, use the '+TargetClouds' directive below in your condor submission file. You can specify more than one cloud with a comma-delimited TargetClouds directive.

Westgrid/hermes - located at the University of Victoria
-------------------------------------------------------

-   54 nodes, each with
    -   19GB RAM available
    -   8 cores
    -   No local storage, but a large shared network mounted file-system (\~50TB)
    -   +TargetClouds="hermes-westgrid"

Westgrid/breezy - located at the University of Calgary
------------------------------------------------------

-   3 nodes, each with
    -   200GB RAM available
    -   24 cores
    -   3TB local storage
    -   +TargetClouds="breezy"

CADC/Small memory nodes - located at NRC Herzberg, Victoria
-----------------------------------------------------------

-   8 nodes, each with
    -   12GB RAM available
    -   8 cores
    -   600GB local storage
    -   +TargetClouds="cadc"

CADC/Large memory nodes - located at NRC Herzberg, Victoria
-----------------------------------------------------------

-   2 nodes, each with
    -   32GB RAM
    -   16 cores
    -   4TB local storage
    -   +TargetClouds="cadc2"


