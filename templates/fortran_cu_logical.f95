PROGRAM cu_logical

  USE constants
  USE lib_functions
  USE upd_nodes
  USE upd_edges

  IMPLICIT NONE

  INTEGER::it_max, it, var_index, node_index
  REAL::int_convert, it_convert
  REAL,DIMENSION(:),ALLOCATABLE::nodes, edges, p, q, new_nodes, new_edges, pert_pw, pert_init, pert_end


  CHARACTER(:),ALLOCATABLE::output

!!! Initializing constants
  it_max = <%= iterations %> ! number of iterations performed during the simulation (30 iterations = 6 months)
  int_convert = 5.0
  it_convert= (it_max/100.0)


!!! Arrays initialization
  ALLOCATE(p(nb_edges))
  ALLOCATE(q(nb_edges))
  ALLOCATE(new_nodes(nb_nodes))
  ALLOCATE(new_edges(nb_edges))
  ALLOCATE(nodes(nb_nodes))
  ALLOCATE(edges(nb_edges))
! ============================================================
! Perturbations arrays initialization
! ============================================================
  ALLOCATE(pert_pw(nb_nodes))
  ALLOCATE(pert_init(nb_nodes))
  ALLOCATE(pert_end(nb_nodes))

!!! Initial state
  nodes = 0.0     ! all initial conditions are set to 0, except those set manually (see below)

<%= initialValues %>

! ============================================================
!!! initializing perturbations pw
! ============================================================
<%= pert_pws %>

! ============================================================
!!! initializing perturbations init
! ============================================================
<%= pert_inits %>

!!! initializing perturbations end
! ============================================================
<%= pert_ends %>

! ============================================================
!!! initializing edges' strengths & latencies
! ============================================================
! Random version

CALL init_random_seed()
CALL RANDOM_NUMBER(p)
CALL RANDOM_NUMBER(q)

! initializing edges p values
<%= ps %>

! initializing edges q values
<%= qs %>

!!! initializing nodes & computing first edges
  !nodes = nodes_0
  edges = update_edges(nodes)


!!! computing states for all but the one last iteration: this is where the perturbations act on the nodes
  DO it = 1, it_max
    !! computing next node values
    new_nodes = update_nodes(edges, nodes)
    !! applying perturbations
    DO node_index = 1, nb_nodes
        if (pert_pw(node_index) >= 0.0 .AND. it <= pert_end(node_index) .AND.  it >= pert_init(node_index)) then
          nodes(node_index) =  pert_pw(node_index)
        end if
    END DO
    !! computing the next edges values
    new_edges = (1.0 - p) * edges + q * p * update_edges(nodes)
    !!! this outputs the nodes before their update

    output = real2char(nodes(1))
    DO var_index = 2, nb_nodes
        output=output // "," // real2char(nodes(var_index))
    END DO

     WRITE (unit=*,fmt="(a)") output

!!! updating the edges / nodes
     edges = new_edges
     nodes = new_nodes

  END DO

!!! freeing resources
  DEALLOCATE(p, q, new_nodes, new_edges, nodes, edges, pert_pw, pert_init, pert_end)

END PROGRAM cu_logical
