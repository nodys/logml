!--------------------------------------------------------------------------------------------------
! MODULE      : lib_update_edges
! DESCRIPTION : contains a function used to update edges
!
! Copyright (C) Novadiscovery. MIT
!--------------------------------------------------------------------------------------------------

module upd_edges

    use constants
    use lib_functions

    implicit none

contains

    ! function updating edges at each iteration
    !--------------------------------------------------------------------------
    ! @param
    ! @return
    function update_edges(nodes) result(edges)
        implicit none
        real,dimension(:)::nodes
        real,dimension(:),allocatable::edges
        allocate(edges(nb_edges))
        edges(EDGE_PIP2__PIP3)                                              = nodes(NODE_PIP2)
        edges(EDGE_PI3K__PIP2)                                              = nodes(NODE_PI3K)
        edges(EDGE_Insulin_receptor_substrat_1__PI3K)                       = nodes(NODE_Insulin_receptor_substrat_1)
        edges(EDGE_anti_PI3K__PI3K)                                         = nodes(NODE_anti_PI3K)
        edges(EDGE_Insulin_receptor__Insulin_receptor_substrat_1)           = nodes(NODE_Insulin_receptor)
        edges(EDGE_Insulin_like_GF1_receptor__Insulin_receptor_substrat_1)  = nodes(NODE_Insulin_like_GF1_receptor)
        edges(EDGE_Insulin_like_growth_factor_1__Insulin_like_GF1_receptor) = nodes(NODE_Insulin_like_growth_factor_1)
        edges(EDGE_Insulin__Insulin_receptor)                               = nodes(NODE_Insulin)
    end function update_edges

end module upd_edges
