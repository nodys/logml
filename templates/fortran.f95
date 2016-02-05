!--------------------------------------------------------------------------------------------------
! PROGRAM     : LogMl : Templage Fortran
! DESCRIPTION : Is used to generate an executable file
!
! Copyright (C) Novadiscovery. MIT
!--------------------------------------------------------------------------------------------------

module lib_graph
    use lib_functions
    implicit none
contains

    !--------------------------------------------------------------------------
    ! definition of constants & common variables
    !--------------------------------------------------------------------------

    integer, parameter:: nb_nodes = <%= nbNodes %>;         ! number of nodes
    integer, parameter:: nb_edges = <%= nbEdges %>;         ! number of edges

    character(LEN = 4), parameter:: it_max_fmt = "(I4)"; ! how to output it_max

    !!! node indexes
<%= nodesIndex %>

    !!! egde indexes
<%= edgesIndex %>

    ! function updating edges at each iteration
    !--------------------------------------------------------------------------
    ! @param
    ! @return
    function update_edges(nodes) result(edges)
        implicit none
        real,dimension(:)::nodes
        real,dimension(:),allocatable::edges
        allocate(edges(nb_edges))
<%= edgesList %>
    end function update_edges


    ! function updating nodes at each iteration
    !--------------------------------------------------------------------------
    ! @param
    ! @return
    function update_nodes(edges,  nodes_0) result(nodes)
        implicit none
        real, dimension(:)::edges,  nodes_0
        real, dimension(:), allocatable::nodes
        allocate(nodes(nb_nodes))
<%= nodesList %>
    end function update_nodes

end module lib_graph
