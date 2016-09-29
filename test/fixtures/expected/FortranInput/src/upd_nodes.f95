!--------------------------------------------------------------------------------------------------
! MODULE      : lib_update_nodes
! DESCRIPTION : contains a function used to update nodes
!
! Copyright (C) Novadiscovery. MIT
!--------------------------------------------------------------------------------------------------

module upd_nodes
    use constants
    use lib_functions
    implicit none
contains
    ! function updating nodes at each iteration
    !--------------------------------------------------------------------------
    ! @param
    ! @return
    function update_nodes(edges, nodes_0) result(nodes)
        implicit none
        real, dimension(:)::edges,  nodes_0
        real, dimension(:), allocatable::nodes
        allocate(nodes(nb_nodes))
        nodes(NODE_PIP3)                         = edges(EDGE_PIP2__PIP3)
        nodes(NODE_PIP2)                         = edges(EDGE_PI3K__PIP2)
        nodes(NODE_PI3K)                         = AND_([edges(EDGE_Insulin_receptor_substrat_1__PI3K), NOT_([edges(EDGE_anti_PI3K__PI3K)])])
        nodes(NODE_Insulin_receptor_substrat_1)  = OR_([edges(EDGE_Insulin_receptor__Insulin_receptor_substrat_1), edges(EDGE_Insulin_like_GF1_receptor__Insulin_receptor_substrat_1)])
        nodes(NODE_Insulin_like_GF1_receptor)    = edges(EDGE_Insulin_like_growth_factor_1__Insulin_like_GF1_receptor)
        nodes(NODE_Insulin_receptor)             = edges(EDGE_Insulin__Insulin_receptor)
        nodes(NODE_Insulin_like_growth_factor_1) = nodes_0(NODE_Insulin_like_growth_factor_1)
        nodes(NODE_Insulin)                      = nodes_0(NODE_Insulin)
        nodes(NODE_anti_PI3K)                    = nodes_0(NODE_anti_PI3K)
    end function update_nodes

end module upd_nodes
